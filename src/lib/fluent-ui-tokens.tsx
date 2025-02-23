// Fix for: Error: Cannot access tokens.spacingVerticalXXXL on the server. 
// You cannot dot into a client module from a server component.
//  You can only pass the imported name through.

import { makeStyles, tokens } from "@fluentui/react-components"

const tokensCopy = { ...tokens }

export { tokensCopy as tokens }
