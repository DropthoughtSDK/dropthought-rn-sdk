import React from 'react'
import {
    View,
    TextInput,
    StyleSheet,
    Platform,
    Keyboard,
    UIManager,
    LayoutAnimation,
    findNodeHandle,
    ScrollView,
} from 'react-native'

/** @typedef {import('react-native').KeyboardEvent} KeyboardEvent */

// compute the offsets from keyboard End coordinate to frame's bottom
/**
 * @param {KeyboardEvent} keyboardEvent
 * @param {number} frameBottomY
 * @param {boolean} show
 */
const computeOffset = (keyboardEvent, frameBottomY = undefined, show) => {
    let offset = 0
    if (keyboardEvent && show && frameBottomY) {
        // the offset from keyboard coordinate to view's bottom Y coordinate
        const keyboardEndY =
            keyboardEvent.endCoordinates.screenY -
            Platform.select({
                // it looks that in android, it didn't consider the the suggestion box of the keyboard
                android: 40,
                default: 0,
            })

        // only consider the negative
        offset = Math.min(keyboardEndY - frameBottomY, 0)
    }
    return offset
}
/**
 * @param {KeyboardEvent} keyboardEvent
 */
const configureLayoutAnimation = (keyboardEvent) => {
    const {duration, easing} = keyboardEvent
    if (duration && easing) {
        LayoutAnimation.configureNext({
            // We have to pass the duration equal to minimal accepted duration defined here: RCTLayoutAnimation.m
            duration: duration > 10 ? duration : 10,
            update: {
                duration: duration > 10 ? duration : 10,
                type: LayoutAnimation.Types[easing] || 'keyboard',
            },
        })
    }
}

export const useKeyboardAvoidingFocusedInputView = (parentViewRef) => {
    const [bottomHeight, setBottomHeight] = React.useState(0)

    const keyboardChangeHandler = React.useCallback(
        (event, show) => {
            const currentlyFocusedField = TextInput.State.currentlyFocusedField()

            // if there's no focused input or keyboard is not show or view is not existed
            if (!currentlyFocusedField || !show || !parentViewRef.current) {
                configureLayoutAnimation(event)
                setBottomHeight(0)
                return
            }

            // here we want to check if the focused input is "within" this view
            // if it is not this view, do nothing (it could be a un-focused screen)
            UIManager.viewIsDescendantOf(
                currentlyFocusedField,
                findNodeHandle(parentViewRef.current),
                (isDescendant) => {
                    if (isDescendant) {
                        // measure the input's layout, compute the offset to the keyboard
                        UIManager.measureInWindow(
                            currentlyFocusedField,
                            (x, y, width, height) => {
                                const currentlyFocusedFieldBottomY = y + height
                                const offset = computeOffset(
                                    event,
                                    currentlyFocusedFieldBottomY,
                                    show,
                                )
                                // if the offset is smaller than 0, it means it is below the keyboard
                                if (offset < 0) {
                                    configureLayoutAnimation(event)
                                    setBottomHeight(0 - offset)
                                }
                            },
                        )
                    }
                },
            )
        },
        [parentViewRef],
    )

    // keyboard change effect
    React.useEffect(() => {
        // subscribe to these keyboard events
        let keyboardEvents = Platform.select({
            default: [
                {name: 'keyboardWillShow', show: true},
                {name: 'keyboardWillHide', show: false},
            ],
            android: [
                {name: 'keyboardDidShow', show: true},
                {name: 'keyboardDidHide', show: false},
            ],
        })

        let subscriptions = keyboardEvents.map((eventInfo) => {
            return Keyboard.addListener(eventInfo.name, (event) =>
                keyboardChangeHandler(event, eventInfo.show),
            )
        })

        return function cleanup() {
            subscriptions.forEach((subscription) => {
                subscription.remove()
            })
        }
    }, [keyboardChangeHandler])

    return {
        bottomHeight,
    }
}

const KeyboardAvoidingView = ({
    children,
    style,
    contentContainerStyle,
    ...props
}) => {
    const viewRef = React.useRef()
    const {bottomHeight} = useKeyboardAvoidingFocusedInputView(viewRef)

    if (Platform.OS === 'android') {
        return (
            <ScrollView style={style} {...props}>
                {children}
            </ScrollView>
        )
    }

    return (
        <View ref={viewRef} style={style} {...props}>
            <View
                style={StyleSheet.compose(styles.contentContainerStyle, {
                    bottom: bottomHeight,
                })}>
                {children}
            </View>
        </View>
    )
}

const KeyboardAvoidingScrollViewForwardRef = (
    {children, style, contentContainerStyle, ...props},
    ref,
) => {
    const {bottomHeight} = useKeyboardAvoidingFocusedInputView(ref)

    if (Platform.OS === 'android') {
        return (
            <ScrollView
                style={style}
                contentContainerStyle={contentContainerStyle}
                {...props}
                ref={ref}>
                {children}
            </ScrollView>
        )
    }

    return (
        <ScrollView
            ref={ref}
            style={style}
            contentContainerStyle={StyleSheet.compose(contentContainerStyle, {
                bottom: bottomHeight,
            })}
            {...props}>
            {children}
        </ScrollView>
    )
}

export const KeyboardAvoidingScrollView = React.forwardRef(
    KeyboardAvoidingScrollViewForwardRef,
)

const styles = StyleSheet.create({
    contentContainerStyle: {
        height: '100%',
    },
})

export default KeyboardAvoidingView
