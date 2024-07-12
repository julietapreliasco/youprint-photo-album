#!/bin/bash

if [ "$VERCEL_GIT_COMMIT_REF" == "YP-next-migration" ]; then
  echo "Building Next.js project"
  echo "NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL" > .env.local
  npm install
  npm run build
  cp -r .next ../output
else
  echo "Building Vite project"
  npm install
  npm run build
  cp -r dist ../output
fi