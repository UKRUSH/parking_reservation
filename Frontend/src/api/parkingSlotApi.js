import axiosInstance from './axiosInstance'

export const parkingSlotApi = {
  getSlots: (type, startTime, endTime) =>
    axiosInstance.get('/parking-slots', { params: { type, startTime, endTime } }),
}
