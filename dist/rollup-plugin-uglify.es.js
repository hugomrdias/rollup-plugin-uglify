import { minify } from 'uglify-js';
import frame from 'babel-code-frame';

var frameOptionsDefaults = {
	highlightCode: true,
	linesAbove: 2,
	linesBelow: 3,
	forceColor: false
};

function uglify(options, minifier) {
	if ( options === void 0 ) options = {};
	if ( minifier === void 0 ) minifier = minify;

	var frameOptions = options.codeFrame ? Object.assign({}, frameOptionsDefaults, options.codeFrame) : frameOptionsDefaults;

	return {
		name: 'uglify',

		transformBundle: function transformBundle(code) {
			options.fromString = true;
			delete options.inSourceMap;
			delete options.outSourceMap;

			// trigger sourcemap generation
			if (options.sourceMap !== false) {
				options.outSourceMap = 'x';
			}

			try {
				var result = minifier(code, options);
			} catch (error) {
				console.error(frame(code, error.line, error.col, frameOptions));
				console.error('Reason: ' + error.message);
				// Throw again so rollup can catch and output as normal
				throw error;
			}

			// Strip sourcemaps comment and extra \n
			if (result.map) {
				var commentPos = result.code.lastIndexOf('//#');
				result.code = result.code.slice(0, commentPos).trim();
			}

			return result;
		}
	};
}

export default uglify;