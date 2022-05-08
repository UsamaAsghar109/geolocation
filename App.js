import React, { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import { Button, PermissionsAndroid, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Alert, ScrollView } from "react-native";
import Geolocation from "@react-native-community/geolocation";
import { run } from "jest";

const classify = () => {
  // let hours = Math.floor(secondsLeft / 60 / 60);
  // let mins = Math.floor(secondsLeft / 60 % 60);
  // let seconds = Math.floor(secondsLeft % 60);

  // let displayHours = hours < 10 ? `0${hours}` : hours;
  // let displayMins = mins < 10 ? `0${mins}` : mins;
  // let displaySeconds = seconds < 10 ? `0${seconds}` : seconds;

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  let date = new Date();

  let year = new Date().getFullYear();
  let month = monthNames[date.getMonth()];
  let extendDate = new Date().getDate();
  var hours = new Date().getSeconds();
  let day = dayNames[date.getDay()];

  return {
    year,
    month,
    extendDate,
    day,
    hours
  }
}

const App = () => {
  const [state, setState] = useState();
  const [longitudeV, setLongitude] = useState();
  const [latitudeV, setLatitude] = useState();
  const [show, setShow] = useState(false);
  const [time, setTime] = useState({
    millisec: 0,
    second: 0,
    minute: 0,
    hour: 0,

  })

  const getLocation = () => {
    Geolocation.getCurrentPosition(info => {
      console.log(info)
      const speedValue = JSON.stringify(info.coords.speed)
      var values = parseInt(speedValue)
      setState(values)
      const latitude = JSON.stringify(info.coords.latitude)
      setLatitude(latitude)
      const longitutde = JSON.stringify(info.coords.longitude)
      setLongitude(longitutde)
      // console.log(setState(info))
    },
      error => Alert.alert(error.message),
      { enableHighAccuracy: true, timeout: 20000 })
  }
  useEffect(() => {
    console.log('First console');
    setInterval(() => {
      getLocation();
    }, 1000);
  }, []);

  useEffect(() => {
    setInterval(() => {
      if (state > 0) {
        run();
        console.log("Moving");
        setInterval(run, 1);


      }
      else {

        console.log("Not moving");
      }
    }, 5000);

  }, [state])

  var updatedMs = time.millisec, updatedS = time.second, updatedM = time.minute, updatedH = time.hour;
  var displayMs = time.millisec >= 10 ? time.millisec : `0${time.millisec}`;
  var displayS = time.second >= 10 ? time.second : `0${time.second}`;
  var displayM = time.minute >= 10 ? time.minute : `0${time.minute}`;
  var displayH = time.hour >= 10 ? time.hour : `0${time.hour}`;
  const run = () => {
    if (updatedM === 60) {
      updatedH++;
      updatedM = 0;
    }
    if (updatedS === 60) {
      updatedM++;
      updatedS = 0;
    }
    if (updatedMs === 60) {
      updatedS++;
      updatedMs = 0;
    }
    updatedMs++;
    return setTime({
      millisec: updatedMs,
      second: updatedS,
      minute: updatedM,
      hour: updatedH
    })
  }

  const requestCameraPermission = async () => {

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message:
            "App needs access to your location ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getLocation();
        console.log("You can use location");

      } else {
        console.log("Location permission denied");
      }
      setShow(true)
    } catch (err) {
      console.warn(err);
    }
  };

  var markersLocation = [
    {
      latitude: latitudeV,
      longitude: longitudeV
    }
  ]

  return (
    <View style={styles.container}>
      <MapView
        showsUserLocation={true}
        showsCompass={true}
        followsUserLocation={true}
        loadingEnabled={true}
        loadingIndicatorColor="#18B2FF"
        style={{ height: '60%', width: '100%' }}
      >
        {/* <Marker
          // coordinate={{ longitude: longitudeV, latitude: latitudeV }}
          pinColor={"purple"}
          title={"Your location"}
        ></Marker> */}

      </MapView>
      <ScrollView>
        <Text>Timer {displayH} hrs {displayM} min {displayS} sec {displayMs} msec</Text>
        <Text style={styles.item}>Speed</Text>
        <View style={styles.speed}>
          <Text style={styles.speedText}>{state}</Text>

        </View>
        <View>
          <Text style={styles.latitudeStyle}>Latitude {latitudeV}</Text>
          <Text style={styles.longitudeStyle}>Longitude {longitudeV}</Text>
        </View>
        <TouchableOpacity style={styles.buttonBackground} onPress={requestCameraPermission} >
          <Text style={styles.getButton}>Get Location</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "white",
    padding: 8
  },
  item: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center"
  },
  speed: {
    backgroundColor: '#18B2FF',
    width: 100,
    height: 100,
    justifyContent: 'center',
    left: '38%',
    borderRadius: 50
  },
  speedText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 30

  },
  getButton: {
    color: 'white',
    textAlign: 'center'
  },
  buttonBackground: {
    width: '50%',
    margin: 20,
    backgroundColor: '#18B2FF',
    alignSelf: 'center',
    borderRadius: 20,
    padding: 10
  },
  latitudeStyle: {

    marginTop: 10,
    color: 'black'
  }
});

export default App;