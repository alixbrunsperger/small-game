/* Tiles */

// Size
tile_w = 32;
tile_h = 32;


// Sprites / tileset
// Solid => 0: non-solid, 1: solid, 2: other (slope)
// Solidity(x,y) => tells if a pixel is solid in a given tile

tiles = {
  
  // 0: void
  "0": {
    sprite: void_sprite,
    solid: 0
  },
  
  // 1: ground_tile1
  "1": {
    sprite: ground_tile1,
    solid: 1
  },
  
  // 2: ground_tile2
  "2": {
    sprite: ground_tile2,
    solid: 1,
  },
  
  // 3: ground_tile3
  "3": {
    sprite: ground_tile3,
    solid: 1,
  },
  
  // 4: ceiling_tile
  "4": {
    sprite: ceiling_tile,
    solid: 1,
  },
};


// Check if a coordinate (x:y) is on a solid pixel or not
is_solid = function(x,y){
  
  var tile_y = Math.floor(y / tile_h);

  // Return false if the pixel is at undefined map coordinates
  if(!maps[current_map][tile_y]){
    return false;
  }
  
  var tile_x = Math.floor(x / tile_w);
  
  if(!maps[current_map][tile_y][tile_x]){
    return false;
  }
  
  // Return false if the tile is not solid
  if(tiles[maps[current_map][tile_y][tile_x]].solid === 0){
    return false;
  }
  
  // Return true if the tile is solid
  if(tiles[maps[current_map][tile_y][tile_x]].solid === 1){
    return true;
  }
}