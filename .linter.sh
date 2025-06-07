#!/bin/bash
cd /home/kavia/workspace/code-generation/splitsnap-35748-be3d9dae/split_snap
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

