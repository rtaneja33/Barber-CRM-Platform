// https://github.com/KPS250/React-Native-Accordion/tree/simple-accordian
import React from 'react';
import { View, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager, FlatList} from "react-native";
import { ListItem } from 'react-native-elements';
import Icon from "../components/Icon";
import { argonTheme } from "../constants";
import { Block, Text } from "galio-framework";
import { argonTheme as nowTheme } from "../constants";
import { color } from 'react-native-reanimated';



class Accordian extends React.Component{

    constructor(props) {
        super(props);
        this.state = { 
          data: props.data,
          expanded : false,
        }

        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
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
          <Icon
              name={this.state.expanded ? 'nav-down' : 'nav-right'}
              family="ArgonExtra"
              size={nowTheme.SIZES.BASE}
              color="white"
          />
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
                  renderItem={({ item }) => ( 
                      
                    <ListItem                  
                      title={`${item.serviceName}`}  
                      subtitle={item.price}     
                     
                      containerStyle={{  backgroundColor:'transparent' }} 
                     ><ListItem.Content>
                        <Block style={styles.subtitleView}>
                            <Text style={styles.serviceFont}>{item.serviceName}</Text>
                            <Text style={styles.ratingText}>{item.price}</Text>
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
                    <Text style={{ color:'#bad555' }}>No Customers Found</Text>
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
        backgroundColor: "#525F7F30",
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