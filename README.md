# Gif countdown generator

The very simple app I have created allows you to generate a countdown timer animated gif depending on the URL parameters you provide. [View demo](https://date-gif.herokuapp.com/). Now no longer maintained.

## URL Parameters (*required)

* **time*** - Date &amp; time when your countdown will end [e.g. 2016-06-24T20:35]
* **frames** - number of frames (also number of seconds) the countdown will run before looping [defaults to 30]
* **width** - width in pixels [defaults to 200]
* **height** - height in pixels [defaults to 200]
* **bg** - hex colour code for the background [defaults to 000000]
* **color** - hex colour code for the text [defaults to ffffff]
* **name** - filename used for the generated gif [defaults to 'default']
            
## Generate Examples

These trigger a download. Change the URL from `/generate` to `/serve` when used in an image tag.

* **Basic**: [/generate?time=2018-09-24T20:35](https://date-gif.herokuapp.com/generate?time=2018-09-24T20:35&name=ex1)
* **Custom dimensions**: [/generate?time=2018-09-24T20:35&width=300&height=150](https://date-gif.herokuapp.com/generate?time=2018-09-24T20:35&width=300&height=150&name=ex2)
* **Custom colours**: [/generate?time=2018-09-24T20:35&bg=028900&color=adff00](https://date-gif.herokuapp.com/generate?time=2018-09-24T20:35&bg=028900&color=adff00&name=ex3)
* **Custom name & frames**: [/generate?time=2018-09-24T20:35&name=awesome-gif&frames=20](https://date-gif.herokuapp.com/generate?time=2018-09-24T20:35&name=awesome-gif&frames=20)

## Versions

Tested with and designed for:

* node 6.0.0
* cairo 1.8.6

## License

[MIT](LICENSE)
