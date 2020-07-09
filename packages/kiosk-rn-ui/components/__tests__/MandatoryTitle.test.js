import React from 'react'
import {render} from '@testing-library/react-native'

import MandatoryTitle from '../MandatoryTitle'

const mockQuestion = {
    category: 'Performant',
    mandatory: false,
    metaDataType: null,
    options: ['Poor', 'Fair', 'Neutral', 'Good', 'Excellent'],
    questionBrand: '',
    questionId: '608f85e9-cd65-4534-ad73-cc02a9769768',
    questionTitle:
        'How Does The App Run After Installation Or Update? (Performant)',
    scale: '5',
    subType: 'slider',
    type: 'rating',
}

test('example test', async () => {
    const {getByText} = render(<MandatoryTitle question={mockQuestion} />)

    mockQuestion.questionTitle.split(' ').forEach((title) => {
        expect(getByText(title)).not.toBeEmpty()
    })
})
