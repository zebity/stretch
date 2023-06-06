#!/bin/bash

GHOST_DIR="$1"
HANDLEBARS_HELPERS=$GHOST_DIR/current/core/frontend/helpers
GSCAN_SPECS=$GHOST_DIR/current/node_modules/gscan/lib/specs

GSCAN_V4=$GSCAN_SPECS/v4.js
GREP_INSTALLED="volume_item"
SED_CMD="\"s/let knownHelpers = \[\(.*\)\]/let knowHelpers = \[\1, 'volume_item','volume_class', 'if_volume'\]/g\""

if [ $# -eq 0 ]; then
  echo "Usage: $0 <GHOST-DIR>"
else
  if [ -d "$GHOST_DIR" ]; then
    if [ -d "$HANDLEBARS_HELPERS" ]; then
      if [ -d "$GSCAN_SPECS" ]; then
        if grep -q $GREP_INSTALLED $GSCAN_V4 ; then
          echo "Info: $GSCAN_V4 already updated, skipping ..."
        else
          echo "Ready to try to sedit!"
          echo "sed cmd: |$SED_CMD|."
          sed -i.bak $SED_CMD $GSCAN_V4
        fi
        echo "Ready to try to copy!"
        cp helpers/*.js "$GHOST_DIR"/current/core/frontend/helpers
      else
        echo "Error: $GSCAN_SPECS not found ..."
      fi
    else
      echo "Error: $HANDLEBARS_HELPERS not found ..."
    fi
  else
    echo "Error: $GHOST_DIR not found ..."
  fi
fi
