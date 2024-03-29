Private files download permission
=================================

DESCRIPTION
----------------------------

Version 7.x-1.x provided "two useful features which Drupal itself is missing: a
simple permission to allow downloading of private files by role, plus the
ability to combine both public and private downloads".

Version 7.x-2.x removed the "global" permission and implements a per-directory
by-user and by-role filter instead, to let the administrator better tweak the
whole website and increment the overall security.

Idea and code (mostly for version 7.x-1.x) were inspired by
http://www.beacon9.ca/labs/drupal-7-private-files-module.
The 7.x-2.x development was partly sponsored by Cooperativa Italiana Artisti
(http://www.cita.coop).
The Drupal 8 port was rewritten from scratch, but many thanks to Paris Liakos
and Andrey Kovtun for their precious help and hints.

INSTALLATION / CONFIGURATION
----------------------------

Browse to Configuration > Media > Private files download permission (url:
/admin/config/media/private-files-download-permission). Then add or edit each
directory path you want to put under control, associating users and roles which
are allowed to download from that location.
All directory paths are relative to your private file system path, but must
have a leading slash ('/'), as the private file system root itself could be put
under control.

E.g.:
Suppose your private file system path is /opt/private.
You could configure /opt/private (and all of its subdirectories) by adding a
'/' entry, while a '/test' entry would specifically refer to /opt/private/test
(and all of its subdirectories).

Please note that per-user checks may slow your site if there are plenty of
users. You can then bypass this feature by browsing to Configuration > Media >
Private files download permission > Settings (url:
/admin/config/media/private-files-download-permission/settings) and change the
setting accordingly.
Additional settings are available to cache users and/or log activities.

Also configure which users and roles have access to the module configuration
under People > Permissions (url: /admin/people/permissions).

\core\modules\file\file.module
function file_file_download($uri) {
  if (!$file->access('download')) {
     return -1;
  }
}
