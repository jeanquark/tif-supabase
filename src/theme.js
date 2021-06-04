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
		background: {
			default: '#fff',
		},
		error: {
			main: red.A400,
		},
		// warning: {
		// },
		// info: {
		// },
		// success: {
		// },
		// action: {
		// 	active: '',
		// 	hover: ''
		// }	
	},
});

export default theme;