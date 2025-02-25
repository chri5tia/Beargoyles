# Readme for Beargoyles.com

![Beargoyle Artwork](https://beargoyles.com/sites/default/files/styles/large/public/2025-02/2025-02-23-05.02.05-v1-oil-transparent.png.webp)

## For Developers

### Config Sync
Find this line in your settings.php and uncomment it. Then update it to show this:

```
$settings['config_sync_directory'] = '../config/sync/';
```

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
