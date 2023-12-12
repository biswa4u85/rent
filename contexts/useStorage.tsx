// import AsyncStorage from '@react-native-async-storage/async-storage';

export const useStorage = () => {
    // Function to get an item from AsyncStorage
    const getItem = async (key: any) => {
        try {
            const value = await sessionStorage.getItem(key);
            return value ? JSON.parse(value) : undefined;
        } catch (error) {
            // console.error('AsyncStorage getItem error:', error);
        }
    };

    // Function to set an item in AsyncStorage
    const setItem = async (key: any, value: any) => {
        try {
            await sessionStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            // console.error('AsyncStorage setItem error:', error);
        }
    };

    // Function to remove an item from AsyncStorage
    const removeItem = async (key: any) => {
        try {
            await sessionStorage.removeItem(key);
        } catch (error) {
            // console.error('AsyncStorage removeItem error:', error);
        }
    };

    return {
        getItem,
        setItem,
        removeItem,
    };
};