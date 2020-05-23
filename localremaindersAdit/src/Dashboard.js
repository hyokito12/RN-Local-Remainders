import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  Alert,
} from 'react-native';
import {ListItem} from 'react-native-elements';
import firebase from 'react-native-firebase';
// import DateTimePicker from 'react-native-modal-datetime-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

export default class Dashboard extends Component {
  state = {
    enableNotification: true,
    isDateTimePickerVisible: false,
    notificationTime: moment({hour: 17}),
  };

  componentDidMount() {
    this.setReminder();
  }
  setReminder = async () => {
    const {notificationTime, enableNotification} = this.state;

    if (enableNotification) {
      // schedule notification
      console.log('create notif', notificationTime.valueOf());
      this.notif = firebase
          .notifications()
          .scheduleNotification(this.buildNotification(), {
            fireDate: notificationTime.valueOf(),
            repeatInterval: 'day',
            exact: true,
          });
      console.log(this.notif);
    } else {
      console.log('gagal');
      return false;
    }
  };

  buildNotification = () => {
    const title = Platform.OS === 'android' ? 'Daily Reminder' : '';
    const notification = new firebase.notifications.Notification({
      // sound: firebase.notifications.Android.Defaults.Sound,
      show_in_foreground: true,
      show_in_background: true,
    })
        .setNotificationId('1') // Any random ID
        .setTitle(title) // Title of the notification
        .setBody('This is a reminder') // body of notification
        .android.setPriority(firebase.notifications.Android.Priority.High) // set priority in Android
        .android.setChannelId('reminder') // should be the same when creating channel for Android
        .android.setAutoCancel(true); // To remove notification when tapped on it
    return notification;
  };

  enableNotification = value => {
    this.setState({
      enableNotification: value,
    });
  };
  showDateTimePicker = () => {
    this.setState({isDateTimePickerVisible: true});
  };
  hideDateTimePicker = () => {
    this.setState({isDateTimePickerVisible: false});
  };
  handleDatePicked = (event, date) => {
    this.hideDateTimePicker();

    console.log(date);
    console.log(moment(date));
    this.setState({
      notificationTime: moment(date),
    });
    this.setReminder();
  };

  render() {
    const {
      enableNotification,
      isDateTimePickerVisible,
      notificationTime,
    } = this.state;
    return (
        <SafeAreaView style={styles.container}>
          <View style={styles.cardTitleView}>
            <Text style={styles.cardTitle}>Add Reminder</Text>
          </View>
          <ListItem
              title="Notification"
              bottomDivider
              titleStyle={styles.titleStyle}
              switch={{
                onValueChange: this.enableNotification,
                value: enableNotification,
              }}
          />
          <ListItem
              title="Time"
              titleStyle={styles.titleStyle}
              onPress={this.showDateTimePicker}
              rightElement={
                <Text style={{opacity: 0.7}}>
                  {moment(notificationTime).format('LT')}
                </Text>
              }
          />
          {this.state.isDateTimePickerVisible && (
              <DateTimePicker
                  isVisible={isDateTimePickerVisible}
                  onChange={this.handleDatePicked}
                  onCancel={this.hideDateTimePicker}
                  mode="time" // show only time picker
                  display="default"
                  is24Hour={false}
                  value={new Date(notificationTime)}
                  titleIOS="Pick your Notification time"
              />
          )}
        </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEFF0',
  },
  cardTitleView: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 8,
  },
  cardTitle: {
    fontSize: 15,
    color: '#585858',
    fontWeight: '600',
  },
  titleStyle: {
    fontSize: 20,
    color: '#585858',
  },
});
