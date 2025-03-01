<?php

namespace Drupal\beargoyles_pdf_tracker\Plugin\Field\FieldFormatter;

use Drupal\Core\Field\FormatterBase;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\media\Entity\Media;

/**
 * Plugin implementation of the 'pdf_download_formatter'.
 *
 * @FieldFormatter(
 *   id = "pdf_download_formatter",
 *   label = @Translation("PDF Download Button"),
 *   field_types = {
 *     "entity_reference"
 *   }
 * )
 */
class PDFDownloadFormatter extends FormatterBase {

  /**
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {
    $elements = [];

    foreach ($items as $delta => $item) {
      // Load the Media entity referenced by this field.
      if ($media = Media::load($item->target_id)) {
        // Ensure it is a "document" media type and contains a file.
        if ($media->hasField('field_media_document') && !$media->get('field_media_document')->isEmpty()) {
          $nid = $items->getEntity()->id();

          // Generate the button for downloading.
          $elements[$delta] = [
            '#type' => 'html_tag',
            '#tag' => 'button',
            '#attributes' => [
              'class' => ['pdf-download-button'],
              'data-nid' => $nid,
            ],
            '#value' => $this->t('Download PDF'),
          ];
        }
      }
    }

    return $elements;
  }
}
