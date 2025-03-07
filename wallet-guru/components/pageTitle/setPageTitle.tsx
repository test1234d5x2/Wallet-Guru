import { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

export default function setPageTitle(title: string) {
  const nav = useNavigation();
  const parent = nav.getParent();

  if (parent) {
    useLayoutEffect(() => {
        parent.setOptions({ headerTitle: title})
    })
  }
  else {
    useLayoutEffect(() => {
        nav.setOptions({ headerTitle: title })
    })
  }
}
