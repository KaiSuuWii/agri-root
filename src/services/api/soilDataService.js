import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const COLLECTION_NAME = "soil-health-data";

export const soilDataService = {
  // Get latest soil health reading
  getLatestReading: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      const readings = [];
      querySnapshot.forEach((doc) => {
        readings.push({ id: doc.id, ...doc.data() });
      });
      // Sort by timestamp and get the latest
      return readings.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      )[0];
    } catch (error) {
      console.error("Error getting latest reading: ", error);
      throw error;
    }
  },

  // Subscribe to real-time updates
  subscribeToReadings: (callback) => {
    const unsubscribe = onSnapshot(
      collection(db, COLLECTION_NAME),
      (snapshot) => {
        const readings = [];
        snapshot.forEach((doc) => {
          readings.push({ id: doc.id, ...doc.data() });
        });
        callback(
          readings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        );
      },
      (error) => {
        console.error("Error listening to readings: ", error);
      }
    );
    return unsubscribe;
  },
};
