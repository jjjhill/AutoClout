# package python stuff

`source venv/Scripts/activate`
`rm -rf build release/build`
`python src/main/ipc/setup.py build`

# package app

`rm -rf release/app/dist/ && npm run package`

# debug prod

`rm -rf release/build/ release/app/dist/ && ELECTRON_ENABLE_LOGGING=true DEBUG_PROD=true npm run package`
`./path/to/exe --remote-debugging-port=8315`

- go to `localhost:8315`

# run locally

`IMAGEMAGICK_BINARY="./bin/ImageMagick/magick.exe" npm start`
