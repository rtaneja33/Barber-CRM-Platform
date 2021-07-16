import React from 'react';
import { withNavigation } from '@react-navigation/compat';
import { TouchableOpacity, StyleSheet, Platform, Dimensions,TextInput, View } from 'react-native';
import { Button, Block, NavBar, Text, theme } from 'galio-framework';

import Icon from './Icon';
import Input from './Input';
import Tabs from './Tabs';
import argonTheme from '../constants/Theme';
import { firebase } from "../src/firebase/config"

const { height, width } = Dimensions.get('window');
const iPhoneX = () => Platform.OS === 'ios' && (height === 812 || width === 812 || height === 896 || width === 896);

const PlusButton = ({isWhite, style, navigation, showImport}) => (
  <TouchableOpacity style={[styles.button, style]} onPress={showImport}>
    <Icon
      family="Feather"
      size={23}
      name="user-plus"
      color={argonTheme.COLORS.HEADER}
    />
    {/* <Block middle style={styles.notify} /> */}
  </TouchableOpacity>
);

const LogoutButton = ({isWhite, style, navigation, onLogout}) => (
  <TouchableOpacity style={[styles.logout, style]} onPress={() => onLogout()}>
    <Icon
      family="MaterialIcons"
      size={22}
      name="logout"
      color={argonTheme.COLORS['BARBERRED']}
    />
  </TouchableOpacity>
);

const PlusButtonService = ({isWhite, style, navigation}) => (
  <TouchableOpacity style={[styles.button, style]}>
    <Icon
      family="AntDesign"
      size={22}
      name="pluscircleo"
      color={argonTheme.COLORS[isWhite ? 'WHITE' : 'ICON']}
    />
    <Block middle style={styles.notify} />
  </TouchableOpacity>
);

const BasketButton = ({isWhite, style, navigation}) => (
  <TouchableOpacity style={[styles.button, style]} onPress={() => navigation.navigate('Pro')}>
    <Icon
      family="ArgonExtra"
      size={16}
      name="basket"
      color={argonTheme.COLORS[isWhite ? 'WHITE' : 'ICON']}
    />
  </TouchableOpacity>
);

const SearchButton = ({isWhite, style, navigation}) => (
  <TouchableOpacity style={[styles.button, style]} onPress={() => navigation.navigate('Pro')}>
    <Icon
      size={16}
      family="Galio"
      name="search-zoom-in"
      color={theme.COLORS[isWhite ? 'WHITE' : 'ICON']}
    />
  </TouchableOpacity>
);

class Header extends React.Component {
  handleLeftPress = () => {
    const { back, navigation } = this.props;
    return (back ? navigation.goBack() : navigation.openDrawer());
  }

  signOutUser = async () => {
    try {
        await firebase.auth().signOut();
        // navigate('SignedOut');
    } catch (e) {
      console.log("error logging out: ", e);
    }
  }

  renderRight = () => {
    const { white, title, navigation, showImport } = this.props;

    if (title === 'Title') {
      return [
        <BasketButton key='basket-title' navigation={navigation} isWhite={white} />
      ]
    }

    switch (title) {
      case 'My Customers':
        return ([
          <PlusButton key='plus-home' navigation={navigation} isWhite={white} showImport={showImport} />
        ]);
      case 'My Shop':
        return ([
          <LogoutButton key='logout' navigation={navigation} onLogout={this.signOutUser.bind(this)}/>
        ]);
      case 'Recent Cuts':
        return ([
          <LogoutButton key='logout' navigation={navigation} onLogout={this.signOutUser.bind(this)}/>
        ]);
      case 'Explore':
        return ([
          <LogoutButton key='logout' navigation={navigation} onLogout={this.signOutUser.bind(this)}/>
        ]);
      
      default:
        break;
    }
  }
  renderSearch = (val) => {
    const { navigation } = this.props;
    return (
        <Input
          left
          // autoFocus = {true}
          hitSlop={{top: 20, bottom: 20, left: 50, right: 40}}
          color="black"
          style={styles.search}
          placeholder="Search My Customers"
          placeholderTextColor={'#8898AA'}
          clearButtonMode = "always"
          onChange = {(event)=> {
            const searchkey = event.nativeEvent.text;
            val(searchkey)}
          }
          iconContent={<Icon size={16} color={theme.COLORS.MUTED} style={{ marginRight: 10 }} name="search1" family="AntDesign" />}
        />
    );
  }
  renderOptions = () => {
    const { navigation, optionLeft, optionRight } = this.props;

    return (
      <Block row style={styles.options}>
        <Button shadowless style={styles.tab} onPress={() => navigation.navigate('Pro')}>
          <Block row middle>
            <Icon size={16} name="bag-17" family="ArgonExtra" style={{ paddingRight: 8 }} color={argonTheme.COLORS.ICON}/>
            <Text size={16} style={styles.tabTitle}>{optionRight || 'Fashion'}</Text>
          </Block>
        </Button>
      </Block>
    );
  }
  renderTabs = () => {
    const { tabs, tabIndex, navigation } = this.props;
    const defaultTab = tabs && tabs[0] && tabs[0].id;
    
    if (!tabs) return null;

    return (
      <Tabs
        data={tabs || []}
        initialIndex={tabIndex || defaultTab}
        onChange={id => navigation.setParams({ tabId: id })} />
    )
  }
  renderHeader = () => {
    const { search, options, tabs, searchFunc } = this.props;
    // console.log("searchFunc is");
    // console.log(searchFunc)
    if ((search && searchFunc) || tabs || options) {
      return (
        <Block center>
          {search ? this.renderSearch(searchFunc) : null}
          {options ? this.renderOptions() : null}
          {tabs ? this.renderTabs() : null}
        </Block>
      );
    }
  }
  render() {
    const { back, title, white, transparent, bgColor, iconColor, titleColor, navigation, ...props } = this.props;

    const noShadow = ['Search', 'Categories', 'Deals', 'Pro', 'Profile'].includes(title);
    const headerStyles = [
      !noShadow ? styles.shadow : null,
      transparent ? { backgroundColor: 'rgba(0,0,0,0)' } : null,
    ];

    const navbarStyles = [
      styles.navbar,
      bgColor && { backgroundColor: bgColor }
    ];

    return (
      <Block style={headerStyles}>
        <NavBar
          back={false}
          title={title}
          style={navbarStyles}
          transparent={transparent}
          right={this.renderRight()}
          rightStyle={{ alignItems: 'center' }}
          left={back &&
            <Icon 
              name={'chevron-left'} family="entypo" 
              size={20} onPress={this.handleLeftPress} 
              color={iconColor || (white ? argonTheme.COLORS.WHITE : argonTheme.COLORS.ICON)}
              style={{ marginTop: 2 }}
            />
          }
          leftStyle={{ paddingVertical: 12 }}
          titleStyle={[
            styles.title,
            { color: argonTheme.COLORS[white ? 'WHITE' : 'HEADER'] },
            titleColor && { color: titleColor }
          ]}
          {...props}
        />
        {this.renderHeader()}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    position: 'relative',
    padding: 12,
  },
  logout: {
    position: 'absolute',
    right: 5,
  },
  title: {
    width: '100%',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  navbar: {
    paddingVertical: 0,
    paddingBottom: theme.SIZES.BASE * 1.5,
    paddingTop: iPhoneX ? theme.SIZES.BASE * 4 : theme.SIZES.BASE,
    zIndex: 5,
  },
  shadow: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  notify: {
    backgroundColor: argonTheme.COLORS.LABEL,
    borderRadius: 4,
    height: theme.SIZES.BASE / 2,
    width: theme.SIZES.BASE / 2,
    position: 'absolute',
    top: 11,
    right: 12,
  },
  header: {
    backgroundColor: theme.COLORS.WHITE,
  },
  divider: {
    borderRightWidth: 0.3,
    borderRightColor: theme.COLORS.ICON,
  },
  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: argonTheme.COLORS.BORDER
  },
  options: {
    marginBottom: 24,
    marginTop: 10,
    elevation: 4,
  },
  tab: {
    backgroundColor: theme.COLORS.TRANSPARENT,
    width: width * 0.35,
    borderRadius: 0,
    borderWidth: 0,
    height: 24,
    elevation: 0,
  },
  tabTitle: {
    lineHeight: 19,
    fontWeight: '400',
    color: argonTheme.COLORS.HEADER
  },
});

export default withNavigation(Header);
