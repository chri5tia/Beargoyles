# Readme for Beargoyles.com

## For Developers

### Config Split
Please edit the bottom of your local settings.php with the following:

```
if (file_exists($app_root . '/' . $site_path . '/settings.local.php')) {
    include $app_root . '/' . $site_path . '/settings.local.php';
}
```
