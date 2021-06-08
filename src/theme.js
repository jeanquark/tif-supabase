import { createMuiTheme } from '@material-ui/core/styles';
import { red, green, orange, blue } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createMuiTheme({
	palette: {
		primary: {
			main: '#FF4500',
		},
		secondary: {
			main: '#19857B',
		},
		background: {
			default: '#fff',
		},
		info: {
			main: blue.A400
		},
		success: {
			main: green.A400
		},
		warning: {
			main: orange.A400
		},
		error: {
			main: red.A400
		},
		// action: {
		// 	active: '',
		// 	hover: ''
		// }	
	},
});

export default theme;