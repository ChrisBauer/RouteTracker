

export default class Helpers {
    static getWaypointName(seq) { 
        return String.fromCharCode(65 + seq % 26);
    }
}