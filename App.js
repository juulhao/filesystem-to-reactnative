import React, { Component } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import RNFS from "react-native-fs";
import walker from "react-native-fs-walker";
import Reactotron from "reactotron-react-native";
import tronwalker from "react-native-fs-walker/tron";

const tron = Reactotron.configure({
  host: "localhost",
  port: 9090 // added code
}) // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .connect(); // let's connect!

const walk = walker(RNFS);

type Props = {};
export default class App extends Component<Props> {
  componentDidMount() {
    let path = RNFS.DocumentDirectoryPath + "/test.txt";

    RNFS.writeFile(path, "Lorem ipsum dolor sit amet", "utf8")
      .then(success => {
        tron.log("FILE WRITTEN!", success);
      })
      .catch(err => {
        tron.log(err.message);
      });

    RNFS.readDir(RNFS.DocumentDirectoryPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
      .then(result => {
        tron.log("GOT RESULT", result);

        // stat the first file
        return Promise.all([RNFS.stat(result[0].path), result[0].path]);
      })
      .then(statResult => {
        if (statResult[0].isFile()) {
          // if we have a file, read it
          return RNFS.readFile(statResult[1], "utf8");
        }

        return "no file";
      })
      .then(contents => {
        // log the file contents
        tron.log(contents);
      })
      .catch(err => {
        tron.log(err.message, err.code);
      });
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>HELLO!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
