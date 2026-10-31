export const HEALTH_INTERVAL=60*60*1000;
export const PLAYTIME_KEY='PET_ACTIVE_PLAYTIME_V1';
export function restorePlaytime(value:string|null) {const number=Number(value);return Number.isFinite(number)?Math.max(0,Math.min(HEALTH_INTERVAL,number)):0;}
export function addPlaytime(elapsed:number,delta:number,visible:boolean) {return visible?Math.min(HEALTH_INTERVAL,elapsed+Math.max(0,delta)):elapsed;}
