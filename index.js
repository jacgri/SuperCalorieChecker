const Alexa = require('alexa-sdk')
const awsSDK = require('aws-sdk')
const docClient = new awsSDK.DynamoDB.DocumentClient()
const HELP_MESSAGE = 'Try saying: Alexa, ask Super Calories Checker how many calories are there in butter'
const STOP_MESSAGE = 'Goodbye!'
const APP_ID = 'amzn1.ask.skill.944f22eb-da6b-4090-8ec6-cc20dda7342f'
const foodItemsTable = 'foodItems'

exports.handler = function (event, template, context) {
  const alexa = Alexa.handler(event, template, context)
  alexa.APP_ID = APP_ID
  alexa.registerHandlers(handlers)
  alexa.execute()
}

const handlers = {
  'AMAZON.HelpIntent' () {
    this.emit(':ask', HELP_MESSAGE, HELP_MESSAGE)
  },
  'AMAZON.CancelIntent' () {
    this.emit(':tell', STOP_MESSAGE)
  },
  'AMAZON.StopIntent' () {
    this.emit(':tell', STOP_MESSAGE)
  },
  Unhandled () {
    this.emit(':tell', HELP_MESSAGE)
  },
  LaunchRequest () {
    this.emit('AMAZON.HelpIntent')
  },
  GetCaloriesIntent () {
    const foodItem = this.event.request.intent.slots.FoodItem.value

    const self = this

    docClient.get({
      TableName: foodItemsTable,
      Key: {
        name: foodItem
      }
    }, function (error, result) {
      if (error || !result) {
        self.emit(':tell', `Sorry, I couldn't find that item in my database`)
      } else {
        const nutrition = result.Item
        self.emit(':tell', `There are ${nutrition.calories} calories in ${nutrition.per} of ${foodItem}`)
      }
    })
  }
}
