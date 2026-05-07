// Seeds catalog_items (global bucket-list ideas). Users/lists/list_items stay empty until the API creates them.

const dbName = process.env.MONGO_INITDB_DATABASE || "summer_bucket_list";
const appDb = db.getSiblingDB(dbName);

appDb.catalog_items.insertMany([
  {
    name: "Watch sunset at Tampa Riverwalk",
    category: "Outdoor",
    due_date: "2026-06-15",
    location: {
      latitude: 27.9475,
      longitude: -82.4584
    }
  },
  {
    name: "Visit The Florida Aquarium",
    category: "Fun",
    due_date: "2026-06-22",
    location: {
      latitude: 27.9427,
      longitude: -82.4459
    }
  },
  {
    name: "Ride coasters at Busch Gardens Tampa Bay",
    category: "Adventure",
    due_date: "2026-07-01",
    location: {
      latitude: 28.0379,
      longitude: -82.4197
    }
  },
  {
    name: "Catch a game at Raymond James Stadium",
    category: "Sports",
    due_date: "2026-07-12",
    location: {
      latitude: 27.9759,
      longitude: -82.5033
    }
  },
  {
    name: "Take photos at Bayshore Boulevard",
    category: "Fun",
    due_date: "2026-07-20",
    location: {
      latitude: 27.9231,
      longitude: -82.4825
    }
  },
  {
    name: "Explore Ybor City food spots",
    category: "Food",
    due_date: "2026-08-03",
    location: {
      latitude: 27.9606,
      longitude: -82.4378
    }
  },
  {
    name: "Walk around Curtis Hixon Waterfront Park",
    category: "Outdoor",
    due_date: "2026-08-08",
    location: {
      latitude: 27.9486,
      longitude: -82.4626
    }
  },
  {
    name: "Beach day at Ben T. Davis Beach",
    category: "Beach",
    due_date: "2026-08-12",
    location: {
      latitude: 27.9683,
      longitude: -82.573
    }
  },
  {
    name: "Visit ZooTampa at Lowry Park",
    category: "Fun",
    due_date: "2026-08-16",
    location: {
      latitude: 28.0106,
      longitude: -82.4638
    }
  },
  {
    name: "See art at Tampa Museum of Art",
    category: "Culture",
    due_date: "2026-08-20",
    location: {
      latitude: 27.9477,
      longitude: -82.463
    }
  },
  {
    name: "Watch a movie at Tampa Theatre",
    category: "Entertainment",
    due_date: "2026-08-24",
    location: {
      latitude: 27.9499,
      longitude: -82.4611
    }
  },
  {
    name: "Take a day trip to Clearwater Beach",
    category: "Travel",
    due_date: "2026-08-28",
    location: {
      latitude: 27.9772,
      longitude: -82.8271
    }
  },
  {
    name: "Sunset walk at Ballast Point Park",
    category: "Outdoor",
    due_date: "2026-08-31",
    location: {
      latitude: 27.9161,
      longitude: -82.4815
    }
  },
  {
    name: "Stroll and snack at Armature Works",
    category: "Food",
    due_date: "2026-09-03",
    location: {
      latitude: 27.9586,
      longitude: -82.4705
    }
  },
  {
    name: "Paddleboard near Davis Islands",
    category: "Fitness",
    due_date: "2026-09-06",
    location: {
      latitude: 27.9147,
      longitude: -82.4569
    }
  },
  {
    name: "Visit Glazer Children's Museum",
    category: "Culture",
    due_date: "2026-09-09",
    location: {
      latitude: 27.9498,
      longitude: -82.4633
    }
  },
  {
    name: "Catch a concert at Amalie Arena",
    category: "Entertainment",
    due_date: "2026-09-12",
    location: {
      latitude: 27.9427,
      longitude: -82.4518
    }
  },
  {
    name: "Bike the Upper Tampa Bay Trail",
    category: "Adventure",
    due_date: "2026-09-16",
    location: {
      latitude: 28.0479,
      longitude: -82.5587
    }
  },
  {
    name: "Take photos at University of Tampa campus",
    category: "Outdoor",
    due_date: "2026-09-20",
    location: {
      latitude: 27.9474,
      longitude: -82.4659
    }
  },
  {
    name: "Explore Lettuce Lake Park boardwalk",
    category: "Nature",
    due_date: "2026-09-24",
    location: {
      latitude: 28.0774,
      longitude: -82.377
    }
  },
  {
    name: "Try local coffee in Hyde Park Village",
    category: "Food",
    due_date: "2026-09-28",
    location: {
      latitude: 27.9363,
      longitude: -82.4748
    }
  },
  {
    name: "Eat Cuban sandwiches at Columbia Restaurant",
    category: "Food",
    due_date: "2026-10-01",
    location: {
      latitude: 27.9614,
      longitude: -82.4384
    }
  },
  {
    name: "Try brunch at Oxford Exchange",
    category: "Food",
    due_date: "2026-10-04",
    location: {
      latitude: 27.9534,
      longitude: -82.4705
    }
  },
  {
    name: "Get tacos at Bartaco Tampa",
    category: "Food",
    due_date: "2026-10-08",
    location: {
      latitude: 27.9361,
      longitude: -82.475
    }
  },
  {
    name: "Dinner at Ulele on the Riverwalk",
    category: "Food",
    due_date: "2026-10-12",
    location: {
      latitude: 27.9577,
      longitude: -82.4696
    }
  },
  {
    name: "Dessert stop at Bake'n Babes",
    category: "Food",
    due_date: "2026-10-16",
    location: {
      latitude: 27.9479,
      longitude: -82.4597
    }
  },
  {
    name: "Seafood dinner at Salt Shack on the Bay",
    category: "Food",
    due_date: "2026-10-20",
    location: {
      latitude: 27.9397,
      longitude: -82.5297
    }
  },
  {
    name: "Day trip to St. Pete Pier",
    category: "Travel",
    due_date: "2026-10-24",
    location: {
      latitude: 27.7731,
      longitude: -82.6316
    }
  },
  {
    name: "Beach day at St. Pete Beach",
    category: "Beach",
    due_date: "2026-10-28",
    location: {
      latitude: 27.7253,
      longitude: -82.7412
    }
  },
  {
    name: "Explore Dali Museum in St. Petersburg",
    category: "Culture",
    due_date: "2026-11-01",
    location: {
      latitude: 27.7653,
      longitude: -82.6314
    }
  },
  {
    name: "Visit Weeki Wachee Springs",
    category: "Nature",
    due_date: "2026-11-05",
    location: {
      latitude: 28.5169,
      longitude: -82.5776
    }
  },
  {
    name: "See marine life at Clearwater Marine Aquarium",
    category: "Fun",
    due_date: "2026-11-09",
    location: {
      latitude: 27.9762,
      longitude: -82.8229
    }
  },
  {
    name: "Sunset at Anna Maria Island",
    category: "Beach",
    due_date: "2026-11-13",
    location: {
      latitude: 27.5312,
      longitude: -82.7334
    }
  },
  {
    name: "Explore downtown Sarasota and bayfront",
    category: "Travel",
    due_date: "2026-11-17",
    location: {
      latitude: 27.3364,
      longitude: -82.5307
    }
  },
  {
    name: "Try Greek food in Tarpon Springs",
    category: "Food",
    due_date: "2026-11-21",
    location: {
      latitude: 28.1461,
      longitude: -82.7568
    }
  },
  {
    name: "Kayak at Weedon Island Preserve",
    category: "Adventure",
    due_date: "2026-11-25",
    location: {
      latitude: 27.8358,
      longitude: -82.6223
    }
  },
  {
    name: "Sunrise walk on Clearwater Beach",
    category: "Beach",
    due_date: "2026-11-29",
    location: {
      latitude: 27.9772,
      longitude: -82.8271
    }
  },
  {
    name: "Try a new boba spot in Tampa",
    category: "Food",
    due_date: "2026-12-03",
    location: {
      latitude: 27.9506,
      longitude: -82.4572
    }
  },
  {
    name: "Watch an outdoor movie at Armature Works",
    category: "Entertainment",
    due_date: "2026-12-07",
    location: {
      latitude: 27.9586,
      longitude: -82.4705
    }
  },
  {
    name: "Attend a Tampa Bay Rays game",
    category: "Sports",
    due_date: "2026-12-11",
    location: {
      latitude: 27.7683,
      longitude: -82.6534
    }
  },
  {
    name: "Visit Hyde Park Village farmers market",
    category: "Fun",
    due_date: "2026-12-15",
    location: {
      latitude: 27.9363,
      longitude: -82.4748
    }
  },
  {
    name: "Sunset picnic at Picnic Island Park",
    category: "Outdoor",
    due_date: "2026-12-19",
    location: {
      latitude: 27.8464,
      longitude: -82.5475
    }
  },
  {
    name: "Hike at Hillsborough River State Park",
    category: "Nature",
    due_date: "2026-12-23",
    location: {
      latitude: 28.1467,
      longitude: -82.2285
    }
  },
  {
    name: "Take a dolphin-watching cruise in Clearwater",
    category: "Adventure",
    due_date: "2026-12-27",
    location: {
      latitude: 27.9778,
      longitude: -82.8275
    }
  },
  {
    name: "Brunch at a new Tampa cafe",
    category: "Food",
    due_date: "2026-12-30",
    location: {
      latitude: 27.9476,
      longitude: -82.459
    }
  },
  {
    name: "Day trip to Honeymoon Island State Park",
    category: "Travel",
    due_date: "2027-01-03",
    location: {
      latitude: 28.0656,
      longitude: -82.8265
    }
  },
  {
    name: "Volunteer at Feeding Tampa Bay",
    category: "Community",
    due_date: "2027-01-07",
    location: {
      latitude: 27.9755,
      longitude: -82.3603
    }
  },
  {
    name: "Stargazing night at Fort De Soto Park",
    category: "Nature",
    due_date: "2027-01-11",
    location: {
      latitude: 27.6348,
      longitude: -82.7254
    }
  },
  {
    name: "Museum and coffee day in downtown Tampa",
    category: "Culture",
    due_date: "2027-01-15",
    location: {
      latitude: 27.9477,
      longitude: -82.463
    }
  }
]);
