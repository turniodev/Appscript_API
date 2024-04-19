function doGet(request) {
  const sheet = SpreadsheetApp.openById("1JfjP2Wl6KkUZxOPd1VHmkqc4B07s2FEHoHal0chhHpg").getSheetByName("database");
  const lastRow  = sheet.getLastRow()
  const dataCol = 4;
  const putCol = dataCol + 1;
  const deleteCol = dataCol + 2
  const passwordCol = 7
  const deleteValue = sheet.getRange(lastRow,deleteCol).getValue()
  const lastCol = sheet.getLastColumn()
  const range = sheet.getRange(2,1, lastRow-1, dataCol)
  const keys = sheet.getRange(1,1, 1, dataCol).getValues()[0]
  const values = range.getValues()

  const lastValue  = sheet.getRange(lastRow, 1, 1, lastCol).getValues()[0]
  if(lastValue[putCol-1]) {
    sheet.getRange(lastValue[putCol-1],1,1,dataCol).setValues(sheet.getRange(lastRow, 1, 1, dataCol).getValues())
    sheet.getRange(lastRow, 1, 1, lastCol).clear()
  }
  if(deleteValue) {
    sheet.getRange(deleteValue,1,1,lastCol).clear()
    sheet.getRange(lastRow,1,1,lastCol).clear()
  }
  let data = []
  values.forEach((item,index)=> {
    data[index] = {}
    item.forEach((i,j)=> {
      data[index]["ID"] = index + 2
      data[index][keys[j]] = i
    })
  })
  data = data.filter(item => item.name)
  if(request.parameter.password && request.parameter.email) {
    const userLogin = data.find(u=> u.email == request.parameter.email)
    if(userLogin) {
      const checkPassword = sheet.getRange(userLogin.ID, passwordCol).getValue()
      if(checkPassword == request.parameter.password) {
        data = {
          status: "Success",
          user: userLogin
        }
        
      } else {
        data = {
          status: "Wrong password"
        }
      }


    } else {
      data = {
        status: "Invalid Email"
      }
    }
  }
  if(request.parameter.forgot) {
    const userForgot = data.find(u => u.email == request.parameter.forgot ) 
    if(userForgot) {
      //  const password = sheet.getRange(userForgot.ID, passwordCol).getValue()
      const random = Math.floor(Math.random() * 1000000).toString().padStart(6,"0")
       MailApp.sendEmail({
        to: userForgot.email,
        subject: "Mã OTP của bạn là",
        htmlBody: `<div> ${random}</div>`
       })
       const codeRange = sheet.getRange(userForgot.ID,passwordCol+1)
       codeRange.setValue(random)
       data = {
        status: "success",
        // code: random
       }
    } else {
      data = {
        status: "Invalid Email"
      }
    }
  }
  if(request.parameter.email && request.parameter.code && request.parameter.changepassword) {
    const userChangePass = data.find(u=> u.email === request.parameter.email)
    const code = sheet.getRange(userChangePass.ID, passwordCol+1).getValue()
    if(code == request.parameter.code) {
      sheet.getRange(userChangePass.ID, passwordCol).setValue(request.parameter.changepassword)
      data = {
        status: "success"
      }
    } else {
      data = {
        status: "Invalid CODE"
      }
    }
  }
  return ContentService.createTextOutput(JSON.stringify({"data":data })).setMimeType(ContentService.MimeType.JSON)
}

