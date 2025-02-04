# Readme for Beargoyles.com

## For Developers

### Config Split
Please edit the bottom of your local settings.php with the following:

```
// Default to production settings
$config['config_split.config_split.dev']['status'] = FALSE;

// Force Drupal to recognize DRUPAL_ENV=dev
putenv('DRUPAL_ENV=dev');
$_ENV['DRUPAL_ENV'] = 'dev';
$_SERVER['DRUPAL_ENV'] = 'dev';

// Enable dev split only if the environment variable is set
if (getenv('DRUPAL_ENV') === 'dev' || $_ENV['DRUPAL_ENV'] === 'dev' || $_SERVER['DRUPAL_ENV'] === 'dev') {
    $config['config_split.config_split.dev']['status'] = TRUE;
}
```
