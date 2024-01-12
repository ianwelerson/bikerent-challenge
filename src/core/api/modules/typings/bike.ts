export interface BikeRent {
  rentAmount: number
  fee: number
  totalAmount: number
}

export interface BikeRentDetails {
  bikeId: number
  userId: number
  dateFrom: string
  dateTo: string
}

export interface BikeReturnDetails {
  bikeId: number
  userId: number
}
