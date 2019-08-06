import {NavigationActions} from "react-navigation";

export const navigateToPage = (pageName, data) => {
  console.log('navigate')
    return NavigationActions.navigate({
        routeName: pageName,
        params: data
    })
};

export const goBack = () => {
    return NavigationActions.back({})
};

export const resetPage = (page) => {
    return NavigationActions.reset({
        index: 0,
        actions: [
            NavigationActions.navigate({routeName: page}),
        ]
    })
};
