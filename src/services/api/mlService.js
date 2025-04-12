import { db } from "../firebase/firebaseConfig";
import { 
  collection, 
  getDoc, 
  getDocs, 
  doc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot 
} from "firebase/firestore";

const ML_COLLECTION_NAME = "machine-learning-model";

export const mlService = {
  /**
   * Get latest fertilizer recommendation
   * @returns {Promise<Object>} Latest fertilizer recommendation
   */
  getLatestRecommendation: async () => {
    try {
      const modelCollection = collection(db, ML_COLLECTION_NAME);
      const modelQuery = query(
        modelCollection,
        orderBy("timestamp", "desc"),
        limit(1)
      );
      
      const querySnapshot = await getDocs(modelQuery);
      if (querySnapshot.empty) {
        return null;
      }
      
      return {
        id: querySnapshot.docs[0].id,
        ...querySnapshot.docs[0].data()
      };
    } catch (error) {
      console.error("Error getting latest ML recommendation: ", error);
      throw error;
    }
  },

  /**
   * Subscribe to real-time fertilizer recommendations
   * @param {Function} callback - Callback function to handle recommendation updates
   * @returns {Function} Unsubscribe function
   */
  subscribeToRecommendations: (callback) => {
    const modelCollection = collection(db, ML_COLLECTION_NAME);
    const modelQuery = query(
      modelCollection,
      orderBy("timestamp", "desc"),
      limit(1)
    );
    
    const unsubscribe = onSnapshot(
      modelQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          const data = {
            id: snapshot.docs[0].id,
            ...snapshot.docs[0].data()
          };
          callback(data);
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error("Error listening to ML recommendations: ", error);
      }
    );
    
    return unsubscribe;
  },

  /**
   * Get recommendation by ID
   * @param {string} id - Recommendation document ID
   * @returns {Promise<Object>} Recommendation data
   */
  getRecommendationById: async (id) => {
    try {
      const docRef = doc(db, ML_COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting recommendation by ID: ", error);
      throw error;
    }
  },

  /**
   * Get recommendations for a specific date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<Array>} Array of recommendations
   */
  getRecommendationsByDateRange: async (startDate, endDate) => {
    try {
      const modelCollection = collection(db, ML_COLLECTION_NAME);
      const querySnapshot = await getDocs(modelCollection);
      const recommendations = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const timestamp = data.timestamp?.toDate() || new Date(data.timestamp);
        
        if (timestamp >= startDate && timestamp <= endDate) {
          recommendations.push({
            id: doc.id,
            ...data
          });
        }
      });
      
      return recommendations.sort((a, b) => {
        return b.timestamp - a.timestamp;
      });
    } catch (error) {
      console.error("Error getting recommendations by date range: ", error);
      throw error;
    }
  }
};

export default mlService;