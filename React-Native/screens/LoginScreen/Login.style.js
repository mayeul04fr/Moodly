import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: '#101018',
    flex: 1,
  },
  image: {
    flex: 1,
  },
  container: {
    marginHorizontal: 29,
    flex: 1,
    justifyContent: 'center',
  },
  headerContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
  },
  subHeaderText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#9DA3A3',
    marginTop: 10,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 16,
    color: '#000000',
    borderWidth: 1,
    borderColor: '#ECECEC',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#17161D',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linearGradient: {
    padding: 22,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#D8DBF4',
  },
});
