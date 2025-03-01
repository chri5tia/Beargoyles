(function ($, Drupal) {
  Drupal.behaviors.beargoylesPdfDownload = {
    attach: function (context, settings) {
      console.log("✅ Beargoyles PDF Download JavaScript behavior attached!");

      $('.pdf-download-button', context).once('pdfDownload').each(function () {
        console.log("✅ Found a PDF download button!");

        $(this).click(function (event) {
          event.preventDefault(); // Prevent default behavior

          var nid = $(this).data('nid');
          console.log("🖱️ Download button clicked. NID:", nid);

          // Ensure we have a valid node ID before making the AJAX call
          if (!nid) {
            console.error("❌ No NID found on button!");
            alert('Error: No valid PDF found.');
            return;
          }

          $.ajax({
            url: '/generate-download-link/' + nid,
            type: 'GET',
            dataType: 'json',
            success: function (response) {
              console.log("🔄 AJAX response received:", response);

              if (response.url) {
                console.log("🔗 Redirecting to:", response.url);
                window.location.href = response.url;
              } else {
                console.error("❌ Failed to generate PDF link.");
                alert('Failed to generate PDF link.');
              }
            },
            error: function (xhr, status, error) {
              console.error("❌ AJAX request failed:", status, error);
              alert('An error occurred while trying to generate the download link.");
            }
          });
        });
      });
    }
  };
})(jQuery, Drupal);

