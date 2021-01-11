import React from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import { Avatar } from "react-native-elements";
import { Card } from "../components/";
import { Block, Text, theme, Button as GaButton } from "galio-framework";

import { Button } from "../components";
import { Images, argonTheme as nowTheme, articles } from "../constants";
import { HeaderHeight } from "../constants/utils";
import zIndex from "@material-ui/core/styles/zIndex";
const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;
const cardWidth = width - nowTheme.SIZES.BASE * 2;
const Articles = () => {
  const categories = [
    {
      image:
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?fit=crop&w=840&q=80",
      price: "Trieu",
    },
    {
      image:
        "https://images.unsplash.com/photo-1543747579-795b9c2c3ada?fit=crop&w=840&q=80",
      price: "Vinny",
    },
    {
      image:
        "https://images.unsplash.com/photo-1543747579-795b9c2c3ada?fit=crop&w=840&q=80",
      price: "Cathy",
    },
    {
      image:
        "https://images.unsplash.com/photo-1543747579-795b9c2c3ada?fit=crop&w=840&q=80",
      price: "John",
    },
    {
      image:
        "https://images.unsplash.com/photo-1543747579-795b9c2c3ada?fit=crop&w=840&q=80",
      price: "Tim",
    },
  ];
  return (
    <Block
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Block flex center>
        <ScrollView
          flex={1}
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled={true}
        >
          <Block flex={1} >
            <ImageBackground
              source={Images.BarberBackground}
              style={styles.profileContainer}
              imageStyle={styles.profileBackground}
            >
              <Block flex>
                <View style={styles.overlay} />
                <Block
                  style={{
                    position: "absolute",
                    width: width,
                    zIndex: 5,
                    paddingHorizontal: 20,
                  }}
                >
                  <Block style={{ top: height * 0.05 }}>
                    <Block middle>
                      <Text
                        style={{
                          fontFamily: "montserrat-bold",
                          marginBottom: nowTheme.SIZES.BASE / 2,
                          fontWeight: "900",
                          fontSize: 26,
                        }}
                        color="#ffffff"
                      >
                        Trieu's Barber Shop
                      </Text>

                      <Text
                        size={16}
                        color="white"
                        style={{
                          marginTop: 2,
                          fontFamily: "montserrat-bold",
                          lineHeight: 20,
                          fontWeight: "bold",
                          fontSize: 18,
                          opacity: 0.9,
                        }}
                      >
                        123 Wallaby Way
                      </Text>
                    </Block>
                  </Block>
                </Block>

                <Block
                  middle
                  row
                  style={{
                    position: "absolute",
                    width: width,
                    top: height * 0.18 - 26,
                    zIndex: 99,
                  }}
                >
                  <Button
                    style={{
                      width: 114,
                      height: 44,
                      marginHorizontal: 5,
                      elevation: 0,
                    }}
                    textStyle={{ fontSize: 16, fontWeight: "bold" }}
                    round
                  >
                    Book
                  </Button>
                </Block>
              </Block>
            </ImageBackground>
          </Block>
          <Block flex={3}>
            <Text bold size={16} style={styles.title}>
              Barbers
            </Text>
            <Block flex>
              <Block style={{ marginTop: nowTheme.SIZES.BASE / 2 }}>
                <ScrollView
                  horizontal={true}
                  nestedScrollEnabled={true}
                  // pagingEnabled={true}
                  scrollEventThrottle={16}
                  // snapToAlignment="center"
                  showsHorizontalScrollIndicator={false}
                  // snapToInterval={cardWidth + nowTheme.SIZES.BASE * 0.375}
                  contentContainerStyle={{
                    paddingHorizontal: 20,
                  }}
                >
                  {categories &&
                    categories.map((item, index) => (
                      <TouchableWithoutFeedback
                        style={{ zIndex: 3 }}
                        key={`product-${item.title}`}
                        onPress={() => alert("clicked Barber")}
                      >
                        <Block center style={styles.productItem}>
                          <Image
                            resizeMode="cover"
                            style={styles.productImage}
                            source={{ uri: item.image }}
                          />
                          <Block
                            center
                            // style={{ paddingHorizontal: theme.SIZES.BASE }}
                          >
                            <Text
                              center
                              size={16}
                              color={theme.COLORS.MUTED}
                              style={styles.productPrice}
                            >
                              {item.price}
                            </Text>
                            {/* <Text center size={34}>
                              {item.title}
                            </Text>
                            <Text
                              center
                              size={16}
                              color={theme.COLORS.MUTED}
                              style={styles.productDescription}
                            >
                              {item.description}
                            </Text> */}
                          </Block>
                        </Block>
                      </TouchableWithoutFeedback>
                    ))}
                </ScrollView>
              </Block>
            </Block>
          </Block>
          {/* </ScrollView>
      </Block> */}
          <Block flex={1} style={{ padding: nowTheme.SIZES.BASE }}>
            {/* <ScrollView showsVerticalScrollIndicator={true}> */}
            <Block flex style={{ marginTop: 20 }}>
              <Block middle>
                <Text
                  style={{
                    color: "#2c2c2c",
                    fontWeight: "bold",
                    fontSize: 19,
                    fontFamily: "montserrat-bold",
                    marginTop: 15,
                    marginBottom: 30,
                    zIndex: 2,
                  }}
                >
                  About me
                </Text>
                <Text
                  size={16}
                  muted
                  style={{
                    textAlign: "center",
                    fontFamily: "montserrat-regular",
                    zIndex: 2,
                    lineHeight: 25,
                    color: "#9A9A9A",
                    paddingHorizontal: 15,
                  }}
                >
                  An artist of considerable range, named Ryan — the name has
                  taken by Melbourne has raised, Brooklyn-based Nick Murphy —
                  writes, performs and records all of his own music.
                </Text>
              </Block>
              <Block
                row
                style={{ paddingVertical: 14, paddingHorizontal: 15 }}
                space="between"
              >
                <Text bold size={16} color="#2c2c2c" style={{ marginTop: 3 }}>
                  Album
                </Text>
                <Button
                  small
                  color="transparent"
                  textStyle={{ color: nowTheme.COLORS.PRIMARY, fontSize: 14 }}
                >
                  View all
                </Button>
              </Block>

              <Block
                style={{
                  paddingBottom: -HeaderHeight * 2,
                  paddingHorizontal: 15,
                }}
              >
                <Block row space="between" style={{ flexWrap: "wrap" }}>
                  {Images.Viewed2.map((img, imgIndex) => (
                    <Image
                      source={img}
                      key={`viewed-${img}`}
                      resizeMode="cover"
                      style={styles.thumb}
                    />
                  ))}
                </Block>
              </Block>
            </Block>
            {/* </ScrollView> */}
          </Block>
        </ScrollView>
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    width,
    padding: 0,
    zIndex: 1,
  },
  overlay: {
    backgroundColor: "black",
    width,
    height: height * 0.18,
    opacity: 0.5,
  },
  profileBackground: {
    width,
    height: height * 0.18,
    opacity: 0.4,
  },
  info: {
    marginTop: 30,
    paddingHorizontal: 10,
    height: height * 0.8,
  },
  avatarContainer: {
    position: "relative",
    marginTop: -80,
  },
  avatar: {
    width: thumbMeasure,
    height: thumbMeasure,
    borderRadius: 50,
    borderWidth: 0,
  },
  nameInfo: {
    marginTop: 35,
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure,
  },
  social: {
    width: nowTheme.SIZES.BASE * 3,
    height: nowTheme.SIZES.BASE * 3,
    borderRadius: nowTheme.SIZES.BASE * 1.5,
    justifyContent: "center",
    zIndex: 99,
    marginHorizontal: 5,
  },
  title: {
    paddingBottom: nowTheme.SIZES.BASE,
    paddingHorizontal: nowTheme.SIZES.BASE * 2,
    marginTop: 22,
    color: nowTheme.COLORS.HEADER,
  },
  group: {
    paddingTop: nowTheme.SIZES.BASE,
  },
  imageBlock: {
    overflow: "hidden",
    borderRadius: 4,
  },
  productItem: {
    width: cardWidth / 4,
    marginHorizontal: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 7 },
    shadowRadius: 10,
    shadowOpacity: 0.2,
  },
  productImage: {
    width: cardWidth / 4,
    height: cardWidth / 4,
    borderRadius: 100,
  },
  productPrice: {
    paddingTop: nowTheme.SIZES.BASE,
    paddingBottom: nowTheme.SIZES.BASE / 2,
  },
  productDescription: {
    paddingTop: nowTheme.SIZES.BASE,
    // paddingBottom: nowTheme.SIZES.BASE * 2,
  },
});

export default Articles;
