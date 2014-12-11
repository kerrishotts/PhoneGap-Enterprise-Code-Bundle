#!/bin/sh
#
# copies the YASMF framework files down to each directory (keeping things up-to-date)
#

echo "Finding all subdirectories..."
for aDir in `find . -name www -noleaf -maxdepth 3 -type d`; do
echo "... Updating $aDir";
echo "... Copying yasmf.js to ./$aDir/js/lib";
cp ~/Documents/Mobile/YASMF/YASMF-Next/dist/*.js "./$aDir/js/lib"
echo "... Copying yasmf.css ./$aDir/js/lib";
cp ~/Documents/Mobile/YASMF/YASMF-Next/dist/yasmf.css "./$aDir/js/lib"
echo "... Copying yasmf assets ./$aDir/js/lib";
cp -r ~/Documents/Mobile/YASMF/YASMF-Next/dist/yasmf-assets "./$aDir/js/lib"
echo "... Done."
done;

echo "Done.";
