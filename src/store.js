import { createStore } from "redux";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

const initialState = {
  troley: [],
};

const reducer = (state = initialState, { type, troley }) => {
  if (type === "setTroley") {
    return { ...state, troley };
  }
  return state;
};


export const store = createStore(reducer);

