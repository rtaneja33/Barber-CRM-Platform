// https://github.com/KPS250/React-Native-Accordion/tree/simple-accordian
import React from 'react';
import { View, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager, FlatList, Dimensions} from "react-native";
import { ListItem } from 'react-native-elements';
import Icon from "../components/Icon";
import { argonTheme } from "../constants";
import { Block, Text } from "galio-framework";
import { argonTheme as nowTheme } from "../constants";
import { color } from 'react-native-reanimated';
import { validateContent } from '../constants/utils';

const { width, height } = Dimensions.get("screen");
class Accordian extends React.Component{

    constructor(props) {
        super(props);
        this.state = { 
          data: props.data,
          expanded : true,
        }

        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }
    renderVerticalSeparator = () => {
      return (
        <View
          style={{
            height: width / 10,
            width: 1,
            backgroundColor: '#CED0CE',
            marginRight: nowTheme.SIZES.BASE
          }}
        />
      )
    }
    renderVerticalServiceSeparator = () => {
      return (
        <View
          style={{
            height: width / 10,
            width: 1,
            backgroundColor: nowTheme.COLORS.HEADER,
            marginRight: nowTheme.SIZES.BASE
          }}
        />
      )
    }

    renderSeparator = () => {
        return (
          <View
            style={{
              height: 1,
              width: '86%',
              backgroundColor: '#CED0CE',
              marginLeft: '5%'
            }}
          />
        )
      }

  render() {

    return (
        <View style={{minHeight:70}}>
      <TouchableOpacity activeOpacity={0.8} ref={this.accordian}  onPress={()=>this.toggleExpand()}>
      <Block row center card shadow space="between" style={styles.card}>
        <Block style={{marginRight: nowTheme.SIZES.BASE}}>
        <Icon
            name="scissors"
            family="entypo"
            size={25}
            color="white"
        />
        </Block>
        <Block flex>
          <Text style={{ color: "white",fontSize: 20, fontWeight: '600' }} size={nowTheme.SIZES.BASE * 1.125}>{this.props.serviceType}</Text>
          <Text style={{ color: "white", paddingTop: 2 }} size={nowTheme.SIZES.BASE * 0.875} muted>Tap for more details </Text>
        </Block>
        <View style={styles.right}>
          { this.props.editable ? 
            (
              <Block row center>
                { this.renderVerticalSeparator() }
                <TouchableOpacity
                  small
                  color="transparent"
                  onPress={() => {
                    if(this.props.editable){
                      this.props.setModalVisible(true);
                      this.props.setServiceField({ 
                        serviceType: {
                          label: 'Service Category',
                          validators: [validateContent],
                        }
                      });
                    }
                }
                }
                >
                  <Icon
                      name="edit"
                      family="FontAwesome5"
                      size={25}
                      color={'white'}
                  />
                </TouchableOpacity>
              </Block>
            ): 
            ( 
            <Icon
              name={this.state.expanded ? 'nav-down' : 'nav-right'}
              family="ArgonExtra"
              size={nowTheme.SIZES.BASE}
              color="white"
            />
          ) 
          }
        </View>
      </Block>
      </TouchableOpacity>
      <View style={styles.parentHr}/>
        {
            this.state.expanded &&
            
            <View style={styles.child}>
                <FlatList
                  data={this.props.services}
                  scrollEnabled={false}
                  renderItem={({ item, index }) => ( 
                    // here, just remove that index from the Service Category in Firestore 
                    <ListItem                  
                      title={`${item.serviceName}`}  
                      subtitle={item.price}     
                     
                      containerStyle={{  backgroundColor:'transparent' }} 
                     ><ListItem.Content>
                        <Block center row style={styles.subtitleView}>
                            <Text style={styles.serviceFont}>{item.serviceName}</Text>
                            <Block center row>
                            <Text style={styles.ratingText}>{item.price}</Text>
                            { this.props.editable ? 
                                (
                                  
                                    <TouchableOpacity
                                      small
                                      color="transparent"
                                      style = {{ marginLeft: 20}}
                                    >
                                      <Icon
                                        name="edit"
                                        family="FontAwesome5"
                                        size={25}
                                        color={nowTheme.COLORS.HEADER}
                                      />
                                    </TouchableOpacity>
                                  
                                ): 
                                ( 
                                <></>
                              ) 
                            }
                            </Block>
                        </Block>
                   </ListItem.Content></ListItem>       
                   )}  
                  keyExtractor={(item, index)=> index.toString()}
                  ItemSeparatorComponent={this.renderSeparator}
                  ListEmptyComponent={()=>(
                    <View style={{
                      flex:1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 50
                    }}>
                    </View>
                  )}
                />
            </View>
        }
    </View>
    )
  }

  toggleExpand=()=>{
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({expanded : !this.state.expanded})
  }

}

const styles = StyleSheet.create({
    card: {
        borderColor: 'transparent',
        // marginVertical: nowTheme.SIZES.BASE / 2,
        marginVertical: 1,
        padding: nowTheme.SIZES.BASE+10,
        shadowOpacity: .4,
        backgroundColor: nowTheme.COLORS.HEADER,
      },
    title:{
        fontSize: 14,
        fontWeight:'bold',
        color: argonTheme.COLORS.MUTED,
    },
    row:{
        flexDirection: 'row',
        justifyContent:'space-between',
        height:56,
        paddingLeft:25,
        paddingRight:18,
        alignItems:'center',
        backgroundColor: argonTheme.COLORS.PRIMARY,
    },
    parentHr:{
        height:1,
        color: argonTheme.COLORS.WHITE,
        width:'100%'
    },
    child:{
        backgroundColor: "#525F7F20",
        padding:16,
    },
    subtitleView: { 
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
      },
      ratingText: {
        color: nowTheme.COLORS.BLACK,
        fontWeight: 'bold',
        fontSize: 18
      },
      serviceFont: {
          fontWeight: 'bold',
          fontSize: 18,
          color: nowTheme.COLORS.HEADER
      }
    
});
export default Accordian;