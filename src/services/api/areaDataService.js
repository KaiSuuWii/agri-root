import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export const areaDataService = {
  /**
   * Save area data with sensor readings and ML recommendations
   * @param {Object} areaData - The area data to save
   * @returns {Promise<Object>} Saved area data with ID
   */
  saveAreaData: async (areaData) => {
    try {
      const areaCollection = collection(db, "area-data");
      const docRef = await addDoc(areaCollection, {
        ...areaData,
        timestamp: new Date(),
      });

      return {
        id: docRef.id,
        ...areaData,
      };
    } catch (error) {
      console.error("Error saving area data:", error);
      throw error;
    }
  },

  /**
   * Get all saved areas
   * @returns {Promise<Array>} Array of saved areas
   */
  getAllAreas: async () => {
    try {
      const areaCollection = collection(db, "area-data");
      const querySnapshot = await getDocs(areaCollection);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error getting areas:", error);
      throw error;
    }
  },

  /**
   * Subscribe to area data updates
   * @param {Function} callback - Callback function to handle updates
   * @returns {Function} Unsubscribe function
   */
  subscribeToAreas: (callback) => {
    const areaCollection = collection(db, "area-data");
    return onSnapshot(areaCollection, (snapshot) => {
      const areas = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(areas);
    });
  },

  /**
   * Get area by ID
   * @param {string} id - Area document ID
   * @returns {Promise<Object>} Area data
   */
  getAreaById: async (id) => {
    try {
      const areaCollection = collection(db, "area-data");
      const q = query(areaCollection, where("__name__", "==", id));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      };
    } catch (error) {
      console.error("Error getting area by ID:", error);
      throw error;
    }
  },
};
