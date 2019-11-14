const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    description: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    description: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

export default [
  // user login
  // {
  //   url: '/user/login',
  //   type: 'post',
  //   response: config => {
  //     const { username } = config.body
  //     const token = tokens[username]
  //
  //     // mock error
  //     if (!token) {
  //       return {
  //         code: 60204,
  //         message: 'Account and password are incorrect.'
  //       }
  //     }
  //
  //     return {
  //       code: 20000,
  //       data: token
  //     }
  //   }
  // },

  // get user info
  // {
  //   url: '/user/info\.*',
  //   type: 'get',
  //   response: config => {
  //     const { token } = config.query
  //     const info = users[token]
  //
  //     // mock error
  //     if (!info) {
  //       return {
  //         code: 50008,
  //         message: 'Login failed, unable to get user details.'
  //       }
  //     }
  //
  //     return {
  //       code: 20000,
  //       data: info
  //     }
  //   }
  // },

  // user logout
  // {
  //   url: '/user/logout',
  //   type: 'post',
  //   response: _ => {
  //     return {
  //       code: 20000,
  //       data: 'success'
  //     }
  //   }
  // }

  // user login
  {
    url: '/intelliDiag/diseaseGradingRule/getAllConditions',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        result: [
          {
            code: 111111,
            name: 'aaaaaa'
          },
          {
            code: 222222,
            name: 'bbbbbb'
          },
          {
            code: 333333,
            name: 'cccccc'
          }
        ]
      }
    }
  },
  {
    url: '/intelliDiag/diseaseGradingRule/getNodesByDiseaseId',
    type: 'get',
    response: config => {
      return {
        code: 20000,
        result: [
          {
            'xaxis': 174.0,
            'yaxis': 264.0,
            'uuid': '5c226d9a-e342-4f23-85d0-a3b41b684f73',
            'id': 'AWYaUvvf_Xy3-P03CHQR',
            'category': 0,
            'cond_type': null,
            'operator': null,
            'values': null,
            'parent_id': null,
            'disease_id': 'AWYaUvvf_Xy3-P03CHQR',
            'diseaseCode': 'N93.901',
            'diseaseName': '呵呵', 'grade': null,
            'level': null,
            'x_axis': 174.0,
            'y_axis': 264.0,
            'size': '78*72',
            'source_anchor': null,
            'target_anchor': null
          }
        ]
      }
    }
  }

]

/*nodes: [
  {
    category: 0,
    color: '#FA8C16',
    condType: null,
    cond_type: null,
    disease_id: 'AWYaUvvf_Xy3-P03CHQR',
    grade: null,
    id: 'AWYaUvvf_Xy3-P03CHQR',
    index: 0, label: '异常子宫出血',
    level: null,
    names: undefined,
    operator: null,
    operatorName: undefined,
    shape: 'circle',
    size: '78*72',
    source_anchor: null,
    target_anchor: null,
    values: null, x: 174, y: 264
  },
  {
    category: 1,
    color: '#1890FF',
    condType: 1,
    cond_type: 1,
    disease_id: 'AWYaUvvf_Xy3-P03CHQR',
    grade: null,
    id: '4e0f1d7e',
    index: 1,
    label: '年龄=0岁',
    level: null,
    names: ['0岁'],
    operator: 'equal',
    operatorName: '=',
    shape: 'flow-rect',
    size: '120*48',
    source_anchor: 3,
    target_anchor: 3,
    values: ['0'],
    x: 337.56055,
    y: 559.5
  }
],
  edges: [
  {
    id: 'ed9361ca',
    index: 2,
    shape: 'flow-polyline-round',
    source: 'AWYaUvvf_Xy3-P03CHQR',
    sourceAnchor: 3,
    target: '4e0f1d7e',
    targetAnchor: 3
  }
]*/
