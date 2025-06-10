#!/bin/bash
lsof -ti :5000 | xargs -r kill -9
lsof -ti :3000 | xargs -r kill -9
(cd server && npm run dev) &
(cd client && npm run dev) &
wait
