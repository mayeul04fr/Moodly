<SafeAreaView style={styles.safeAreaView}>
        <StatusBar style="auto" />
        <View
          style={styles.progressBar}
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            setProgressBarWidth(width);
          }}
        >
          <View
            style={[styles.progressBarIn, { width: progressBarWidth / 3 }]}
          ></View>
        </View>
        <View style={styles.container}>
          <Text style={styles.welcome}>Bonjour {username},</Text>
          <View style={styles.row}>
            <Text style={styles.test}>Let’s do your check-in</Text>
          </View>
          <Text style={styles.test2}>
            Tap the color that best describes how you feel right now
          </Text>
          <View style={styles.emotionsContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Details')}>
              <LinearGradient
                colors={['#FE7A40', '#F5365B']}
                style={styles.emotion1}
              >
                <Text style={styles.textInEmotion}>Stréssé</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Value')}>
              <LinearGradient
                colors={['#FAE36B', '#FDB61D']}
                style={styles.emotion2}
              >
                <Text style={styles.textInEmotion}>Relaxé</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <LinearGradient
                colors={['#87C1FD', '#7282FF']}
                style={styles.emotion3}
              >
                <Text style={styles.textInEmotion}>Énergique</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => disconect()}>
              <LinearGradient
                colors={['#88EEA3', '#41C888']}
                style={styles.emotion4}
              >
                <Text style={styles.textInEmotion}>Content</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>