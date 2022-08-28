const { configureStore } = require('@reduxjs/toolkit');
const { userReducer } = require('./userSlice');

const store = configureStore({
    reducer: {
        user: userReducer,
    },
});

export default store;
