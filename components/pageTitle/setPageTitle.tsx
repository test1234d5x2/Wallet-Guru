import { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

export default function setPageTitle(title: string) {
    const nav = useNavigation();

    useLayoutEffect(() => nav.setOptions({headerTitle: title}))
}