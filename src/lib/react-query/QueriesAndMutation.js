import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { addHomePhoto, deleteHomePost, getHomePhotos, updateHomePhoto } from "../api/homeApi"
import { QUERY_KEYS } from "./queryKey";
import { deleteRoomPost, getRoomPhotos, newRoomGallery } from "../api/roomGalleryApi";
import { changeAdminPassword, deleteAdminUser, getAdminUsers, registerNewUser } from "../api/userApi";
import { addAccommodationImage, addSchedule, deleteAccommodationImage, getAccommodationImages, getAccommodations, getSchedules, newAccommodation } from "../api/accommodationApi";
import { getRatingTotals } from "../api/ratingApi";
import { getTodayBookingCount } from "../api/bookingApi";
import { deleteRoomType, getRoomTypes, newRoomType } from "../api/roomTypeApi";


// home gallery
export const useAddHomePhoto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => addHomePhoto(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_HOME_PHOTOS]
      })
    }
  })
}
export const useUpdateHomePhoto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateHomePhoto({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_HOME_PHOTOS]
      })
    }
  })
}

export const useGetHomePhotos = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_HOME_PHOTOS],
    queryFn: getHomePhotos
  })
}
export const useDeletePhoto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteHomePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_HOME_PHOTOS]
      })
    }
  })
}

// room gallery

export const useAddRoomPhoto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => newRoomGallery(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ROOM_PHOTOS]
      })
    }
  })

}
export const useGetRoomPhotos = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ROOM_PHOTOS],
    queryFn: getRoomPhotos
  })
}
export const useDeleteRoomPhoto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteRoomPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ROOM_PHOTOS]
      })
    }
  })
}

// admin users
export const useDeleteAdminUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteAdminUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ADMIN_USERS]
      })
    }
  })
}
export const useGetAdminUsers = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ADMIN_USERS],
    queryFn: getAdminUsers
  })
}

export const useRegisterNewUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ...data }) => registerNewUser({ ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ADMIN_USERS]
      })
    }
  })

}

export const useChangeAdminPassword = () => {
  return useMutation({
    mutationFn: ({ userId, data }) => changeAdminPassword({ userId, data }),
    onSuccess: (response) => {
      console.log("Password changed:", response.message);
    },
    onError: (error) => {
      console.error("Failed to change password:", error);
    }
  });
};

// accommodations

export const useAddNewAccommodation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => newAccommodation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ACCOMODATIONS],
      });
    },
  });
};
export const useGetAccommodations = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ACCOMODATIONS],
    queryFn: getAccommodations
  })
}

export const useGetAccommodationImages = (accommodationId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ACCOMODATION_IMAGES, accommodationId],
    queryFn: () => getAccommodationImages(accommodationId),
    enabled: !!accommodationId,
  });
};

export const useAddAccommodationImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) => addAccommodationImage(formData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ACCOMODATION_IMAGES, variables.get("accommodation_id")],
      });
    },
  });
};

export const useDeleteAccommodationImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteAccommodationImage(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ACCOMODATION_IMAGES],
      });
    },
  });
};

// add schedule

export const useAddSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ date, accommodationId }) => addSchedule({ date, accommodationId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_SCHEDULES]
      })
    }
  });
};

export const useGetSchedules = (accommodationId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_SCHEDULES, accommodationId],
    queryFn: () => getSchedules(accommodationId),
    enabled: !!accommodationId,

  });
}
// ratings
export const useGetRatingTotals = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RATINGS],
    queryFn: getRatingTotals,
  });
};

// bookings
export const useGetBookingsTodayCount = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_TODAY_BOOKINGS_COUNT],
    queryFn: getTodayBookingCount
  });
};


// room types
export const useAddRoomType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => newRoomType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ROOM_TYPES],
      });
    },
  });
};

export const useGetRoomTypes = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ROOM_TYPES],
    queryFn: getRoomTypes,
  });
};

export const useDeleteRoomType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteRoomType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_ROOM_TYPES],
      });
    },
  });
};
