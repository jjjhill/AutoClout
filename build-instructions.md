# package python stuff

- install python 3.9.9

`source venv/Scripts/activate`
`rm -rf build release/build`
`python src/main/ipc/setup.py build`

# package app

`rm -rf release/app/dist/ && npm run package`

# run locally

`IMAGEMAGICK_BINARY="./bin/ImageMagick/magick.exe" npm start`

# debug prod

`rm -rf release/build/ release/app/dist/ && ELECTRON_ENABLE_LOGGING=true DEBUG_PROD=true npm run package`
`./path/to/exe --remote-debugging-port=8315`

- go to `localhost:8315`
