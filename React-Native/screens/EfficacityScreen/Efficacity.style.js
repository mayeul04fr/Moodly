import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 20,
    textAlign: 'center',
    width: '78%',
    color: '#383542',
  },
  sliderWrapper: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderTrackContainer: {
    position: 'relative',
    width: '100%',
    height: 20,
    justifyContent: 'center',
  },
  sliderTrack: {
    position: 'absolute',
    top: -6,
    width: '100%',
    height: 40,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECECEC',
    borderRadius: 30,
  },
  slider: {
    position: 'absolute',
    zIndex: 2,
    width: '100%',
    height: 40,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 25,
  },
  stepText: {
    fontSize: 16,
    color: '#9DA3A3',
  },
});
