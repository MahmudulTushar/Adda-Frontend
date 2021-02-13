export const SetLocalStorageData = (key,value) =>{
  localStorage.setItem(key, JSON.stringify(value));
}

export const GetLocalStorageData = (key) =>{
  const LocalStorageValue  = localStorage.getItem(key);
  return JSON.parse(LocalStorageValue);
}

export const RemoveLocalStorageData = (key) =>{
  localStorage.removeItem(key)
}

export const LocalStorageConst ={
  user : 'user',
}