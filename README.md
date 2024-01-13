# nim-angular

This project was created using the [Angular](https://www.angular.io) framework. The code for the backend can be found in the [nim-backend](https://www.github.com/matt-marko/nim-backend) repository.

## Links 

Link to application: https://nim-angular.netlify.app/

## Information

This app lets you play a game of [nim](https://en.wikipedia.org/wiki/Nim) either against a friend or the computer. After pressing play, choose "Two players" to take turns playing with a friend, or choose "One player" to play against the computer. If you win against the computer, you will be given a chance to save your score, which is the number of moves you made.

When playing in one player mode, you can select one of two difficulties: easy and impossible. In easy mode, the computer makes random moves each time. In impossible mode, the computer makes the optimal move each time, making it impossible for the player to win.

The code also contains unit tests, written in [Jasmine](https://jasmine.github.io/). For more information about how to run unit tests, see [angular-readme.md](angular-readme.md)

The code for the backend, which handles the saving of high scores, was written separately in Java. The repository for it can be found at [nim-backend](https://www.github.com/matt-marko/nim-backend).

## Rules

Two players take turns removing matches set up in five rows. On their turn, a player can remove any number of matches provided they all come from the same row. You can remove matches by clicking on them. The player who is forced to remove the last match loses.

## Local Setup

More information about Angular, running the project locally, and running unit tests locally may be found in [angular-readme.md](angular-readme.md)
