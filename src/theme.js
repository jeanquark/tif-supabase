import { createMuiTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createMuiTheme({
	palette: {
		primary: {
			main: '#FF4500',
		},
		secondary: {
			main: '#19857B',
		},
		error: {
			main: red.A400,
		},
		background: {
			default: '#fff',
		}
	},
});

export default theme;