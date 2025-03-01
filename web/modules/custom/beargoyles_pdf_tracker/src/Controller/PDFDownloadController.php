<?php

namespace Drupal\beargoyles_pdf_tracker\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Database\Database;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;
use Drupal\file\Entity\File;
use Drupal\node\Entity\Node;

/**
 * Handles PDF download links and tracking.
 */
class PDFDownloadController extends ControllerBase {

  /**
   * Generate a unique download link for a PDF.
   */
  public function generateDownloadLink($nid) {
    $node = Node::load($nid);
    if (!$node || !$node->hasField('field_coloring_page_file') || $node->get('field_coloring_page_file')->isEmpty()) {
      return new Response('PDF not found.', 404);
    }

    // Get the file entity.
    $media = $node->get('field_coloring_page_file')->entity;
    if ($media && $media->hasField('field_media_document') && !$media->get('field_media_document')->isEmpty()) {
      $file = $media->get('field_media_document')->entity;
      $fid = $file->id();
    } else {
      return new Response('PDF not found.', 404);
    }

    // Generate a unique token.
    $token = bin2hex(random_bytes(16));
    $expires = time() + 86400; // 24 hours from now.

    // Store the link in the database.
    $connection = Database::getConnection();
    $connection->insert('beargoyles_pdf_downloads')
      ->fields([
        'nid' => $nid,
        'fid' => $fid,
        'token' => $token,
        'expires' => $expires,
        'timestamp' => time(),
      ])
      ->execute();

    // Return the generated link.
    return new JsonResponse(['url' => \Drupal::request()->getSchemeAndHttpHost() . "/download/$token"]);
  }

  /**
   * Handle the PDF download request.
   */
  public function download($token) {
    $connection = Database::getConnection();
    $query = $connection->select('beargoyles_pdf_downloads', 'd')
      ->fields('d', ['nid', 'fid', 'expires'])
      ->condition('token', $token)
      ->execute()
      ->fetchAssoc();

    if (!$query || time() > $query['expires']) {
      return new RedirectResponse('/'); // Expired or invalid link.
    }

    // Load the file.
    $file = File::load($query['fid']);
    if (!$file) {
      return new Response('File not found.', 404);
    }

    $filepath = $file->getFileUri();
    $filename = $file->getFilename();
    $headers = [
      'Content-Type' => 'application/pdf',
      'Content-Disposition' => 'attachment; filename="' . $filename . '"',
    ];

    // Log the download.
    $connection->insert('beargoyles_pdf_downloads')
      ->fields([
        'nid' => $query['nid'],
        'fid' => $query['fid'],
        'ip_address' => \Drupal::request()->getClientIp(),
        'timestamp' => time(),
        'user_agent' => \Drupal::request()->headers->get('User-Agent'),
        'referrer' => \Drupal::request()->headers->get('Referer'),
        'token' => $token,
      ])
      ->execute();

    return new Response(file_get_contents(\Drupal::service('file_system')->realpath($filepath)), 200, $headers);
  }
}
