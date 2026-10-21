#!/usr/bin/env bash
# Renders the RAG Short, sb7 version, with the shared kit in ../rag-short/.
# Usage: ./build.sh [out.mp4] [extra render-pro.js flags]
here=$(cd "$(dirname "$0")" && pwd)
SHORT_DIR=$here SCRIPT=$here/../../scripts/rag-short-sb7.md exec "$here/../rag-short/build.sh" "$@"
